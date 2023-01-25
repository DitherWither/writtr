<script lang="ts">
	import { requireLogin } from "$lib/user";
    import type { Post } from "$lib/post";
    import PostForm from "$lib/PostForm.svelte"
	import { addDoc, collection } from "firebase/firestore";
	import { firestore } from "$lib/firebase";

    let form: any;

    requireLogin();
    
    async function create() {
        let fields: Post;
        try {
            fields = form.getFields();
            await addDoc(collection(firestore, "posts"), Object.assign({}, fields));
            // console.log(fields);
        } catch (error) {
            alert(error);
        }

    }
</script>

<PostForm bind:form={form}/>
<div class="text-center">
    <button class="btn btn-primary" on:click={create}>Submit</button>
</div>